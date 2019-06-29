package com.google.codeu.servlets;

import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/message")
public class MessageServlet extends HttpServlet {

  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with a JSON representation of Message data for all users.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException {

    response.setContentType("application/json");

    String messageId = request.getParameter("messageId");
    Message message = new Message();

    try {
      message = datastore.getMessage(messageId);
    } catch (Exception e) {
      System.err.println("Error adding user to message.");
      e.printStackTrace();
    }

    Gson gson = new Gson();
    String json = gson.toJson(message);

    response.getWriter().println(json);
  }

}
