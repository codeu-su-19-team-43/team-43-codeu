package com.google.codeu.servlets;

import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.List;

import java.util.stream.Collectors;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Handles fetching all messages for the public feed.
 */
@WebServlet("/feed")
public class MessageFeedServlet extends HttpServlet {
  
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
    
    List<Message> messages = datastore.getAllMessages();

    String imageLabel = request.getParameter("imageLabel");

    if (imageLabel != null && imageLabel != "") {
      messages = messages.stream()
          .filter(message -> message.getImageLabels() != null && message.getImageLabels().contains(imageLabel))
          .collect(Collectors.toList());
    }

    Gson gson = new Gson();
    String json = gson.toJson(messages);
    
    response.getOutputStream().println(json);
  }
}