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
Returns UFO data as a JSON array, e.g. [{"lat": 38, "lng":-122}]
**/

@WebServlet("/mapLocations")
public class MapLocationServlet extends HttpServlet {

  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with a JSON array containing marker data.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    List<com.google.codeu.data.MapLocation> mapLocations = datastore.getMapLocations();
    Gson gson = new Gson();
    String json = gson.toJson(mapLocations);

    response.getOutputStream().println(json);
  }
}
