package com.google.codeu.servlets;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Scanner;

/**
Returns UFO data as a JSON array, e.g. [{"lat": 38, "lng":-122}]
**/

@WebServlet("/photographers-hub")
public class MapDataServlet extends HttpServlet{
	private JsonArray photographyPlaces;

	@Override
	public void init(){
		photographyPlaces = new JsonArray();
		Gson gson = new Gson();
		Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/PhotographyPlaces.csv"));
		while(scanner.hasNextLine()){
			String line = scanner.nextLine();
			String[] cells = line.split(",");
			double lat = Double.parseDouble(cells[0]);
			double lng = Double.parseDouble(cells[1]);
			photographyPlaces.add(gson.toJsonTree(new PhotographyPlace(lat, lng)));
		}
		scanner.close();
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
		response.setContentType("application/json");
		response.getOutputStream().println(photographyPlaces.toString());
	}

	private static class PhotographyPlace{
		double lat;
		double lng;

		private PhotographyPlace(double lat, double lng){
			this.lat = lat; 
			this.lng = lng;
		}
	}
}
