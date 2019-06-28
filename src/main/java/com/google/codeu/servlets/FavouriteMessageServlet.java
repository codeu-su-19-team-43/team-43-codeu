package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.Getter;
import lombok.Setter;

/**
 * Handles fetching and saving favourite messages of a user.
 */
@WebServlet("/favourite")
public class FavouriteMessageServlet extends HttpServlet {

  private Datastore datastore;

  @Getter
  @Setter
  private class FavouriteMessageRequestBody {
    String userEmail;
    String messageId;
  }


  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with a JSON representation of favourite {@link Message} data for a specific user.
   * Returns an empty array if the message doesn't exist.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    String userEmail = request.getParameter("userEmail");

    if (userEmail == null || userEmail.equals("")) {
      // Request is invalid, return empty array
      response.getWriter().println("[]");
      return;
    }

    List<Message> favouriteMessages = datastore.getFavouriteMessagesForUser(userEmail);
    Gson gson = new Gson();
    String json = gson.toJson(favouriteMessages);

    response.getWriter().println(json);
  }

  /**
   * Stores a new {@link Message} as favourite for the user with given email.
   * Request body should contain userEmail and messageId.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    FavouriteMessageRequestBody requestBody = new Gson().fromJson(
            request.getReader(),
            FavouriteMessageRequestBody.class
    );

    String userEmail = requestBody.getUserEmail();
    String messageId = requestBody.getMessageId();

    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn() || !userService.getCurrentUser().getEmail()
            .equals(userEmail)) {
      response.sendRedirect("/index.html");
      return;
    }

    datastore.addMessageToUserAsFavourite(userEmail, messageId);
  }
}
