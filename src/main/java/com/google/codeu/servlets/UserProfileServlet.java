package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.Util;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.User;
import com.google.gson.Gson;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.Getter;
import lombok.Setter;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

// Handles fetching and saving user data.
@WebServlet("/user-profile")
public class UserProfileServlet extends HttpServlet {
  
  private Datastore datastore;

  @Getter
  @Setter
  private class PostProfileRequestBody {
    String username;
    String location;
    String organization;
    String website;
    String aboutme;
    String langCodeForTranslation;
  }
  
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

    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException {

    PostProfileRequestBody requestBody = new Gson().fromJson(
        request.getReader(),
        PostProfileRequestBody.class
    );
          
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

    user.setUsername(Jsoup.clean(requestBody.getUsername(), Whitelist.basic()));
    user.setLocation(Jsoup.clean(requestBody.getLocation(), Whitelist.basic()));
    user.setOrganization(Jsoup.clean(requestBody.getOrganization(), Whitelist.basic()));
    user.setWebsite(Jsoup.clean(requestBody.getWebsite(), Whitelist.basic()));
    user.setAboutMe(Jsoup.clean(requestBody.getAboutme(), Whitelist.basic()));

    // Validate language code before setting it in datastore
    String langCodeForTranslation = Util.DEFAULT_LANG_CODE_FOR_TRANSLATION;
    String givenlangCodeForTranslation = Jsoup.clean(requestBody.getLangCodeForTranslation(),
            Whitelist.basic()).trim();
    if (givenlangCodeForTranslation.equals("")
            || Util.checkIfValidLanguageCode(givenlangCodeForTranslation)) {
      langCodeForTranslation = givenlangCodeForTranslation;
    }
    user.setLangCodeForTranslation(langCodeForTranslation);

    datastore.storeUser(user);
    
    response.sendRedirect("/user-page.html?user=" + userEmail);
  }
}