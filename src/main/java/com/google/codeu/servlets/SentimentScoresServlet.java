package com.google.codeu.servlets;

import com.google.codeu.data.Datastore;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Handles fetching sentiment scores of messages.
 */
@WebServlet("/sentiment-scores")
public class SentimentScoresServlet extends HttpServlet {
  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with sentiment scores in JSON.
   */
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    List<Double> sentimentScores = datastore.getSentimentScores();
    Gson gson = new Gson();
    String json = gson.toJson(sentimentScores);

    response.getWriter().println(json);
  }
}
