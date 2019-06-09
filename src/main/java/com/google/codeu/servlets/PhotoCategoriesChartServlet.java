package com.google.codeu.servlets;


import java.io.IOException;
import java.util.Scanner;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

/**
 * Handles fetching resources for displaying the photo categories chart.
 */
@WebServlet("/photo-categories-chart")
public class PhotoCategoriesChartServlet extends HttpServlet {
    private JsonArray photoCategoriesArray;

    @Override
    public void init() {
        photoCategoriesArray = new JsonArray();
        Gson gson = new Gson();
        Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/photo-categories.csv"));
        scanner.nextLine(); // skips column names
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            String[] cells = line.split(",");

            String currCategoryName = cells[1];
            int currPhotoCount = Integer.parseInt(cells[2]);

            photoCategoriesArray.add(gson.toJsonTree(new photoCategory(currCategoryName, currPhotoCount)));
        }
        scanner.close();
    }

    /**
     * Responds with data for the photo categories chart in JSON.
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.getOutputStream().println(photoCategoriesArray.toString());
    }

    private static class photoCategory {
        String categoryName;
        int photoCount;

        private photoCategory(String categoryName, int photoCount) {
            this.categoryName = categoryName;
            this.photoCount = photoCount;
        }
    }
}