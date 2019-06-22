package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.repackaged.com.google.gson.Gson;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.User;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

// Handles fetching and saving user data.
@WebServlet("/user-profile")
public class UserProfileServlet extends HttpServlet {
  
  private Datastore datastore;
  
  @Override
  public void init() {
    datastore = new Datastore();
  }
  
  // Responds with the "about me" section for a particular user.
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    response.setContentType("application/json;charset=UTF-8");

    String user = request.getParameter("user");
    if (user == null || user.equals("")) {
      // Request is invalid, return empty response
      return;
    }

    User userData = datastore.getUser(user);
    Gson gson = new Gson();
    String json = gson.toJson(userData);
    response.getOutputStream().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException {
          
    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/index.html");
      return;
    }

    String userEmail = userService.getCurrentUser().getEmail();

    User user = datastore.getUser(userEmail);
    if (user == null) {
      user = new User();
      user.setEmail(userEmail);
    }
    user.setUsername(Jsoup.clean(request.getParameter("username"), Whitelist.basic()));
    user.setLocation(Jsoup.clean(request.getParameter("location"), Whitelist.basic()));
    user.setOrganization(Jsoup.clean(request.getParameter("organization"), Whitelist.basic()));
    user.setWebsite(Jsoup.clean(request.getParameter("website"), Whitelist.basic()));
    user.setAboutMe(Jsoup.clean(request.getParameter("aboutme"), Whitelist.basic()));

    datastore.storeUser(user);
    
    response.sendRedirect("/user-page.html?user=" + userEmail);
  }
}