package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Comment;
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

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

/**
 * Handles fetching and saving comments on {@link Message}
 * instances.
 */
@WebServlet("/comments")
public class CommentServlet extends HttpServlet {

  private Datastore datastore;

  @Getter
  @Setter
  private class PostCommentRequestBody {
    String messageId;
    String userText;
  }

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with a JSON representation of {@link Comment} data for a specific message.
   * Returns an empty array if the message doesn't exist.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    String messageId = request.getParameter("messageId");

    if (messageId == null || messageId.equals("")) {
      // Request is invalid, return empty array
      response.getWriter().println("[]");
      return;
    }

    List<Comment> comments = datastore.getCommentsForMessage(messageId);
    Gson gson = new Gson();
    String json = gson.toJson(comments);

    response.getWriter().println(json);
  }

  /**
   * Stores a new {@link Comment} for the {@link Message}.
   * Request body should contain the messageId and the comment object.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    PostCommentRequestBody requestBody = new Gson().fromJson(
            request.getReader(),
            PostCommentRequestBody.class
    );

    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/index.html");
      return;
    }

    String messageId = requestBody.getMessageId();
    String user = userService.getCurrentUser().getEmail();
    String rawUserText = requestBody.getUserText();
    String userText = Jsoup.clean(rawUserText, Whitelist.basic());
    Comment comment = new Comment(user, userText);

    datastore.addCommentToMessage(messageId, comment);
  }
}

