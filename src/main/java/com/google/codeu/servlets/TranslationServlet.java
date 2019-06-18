package com.google.codeu.servlets;

import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import com.google.gson.Gson;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.Getter;
import lombok.Setter;

/**
 * Takes a request that contains text and a language code and responds
 * with translated text in that language.
 */
@WebServlet("/translate")
public class TranslationServlet extends HttpServlet {

  @Getter
  @Setter
  private class TranslationRequestBody {
    String text;
    String languageCode;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the request parameters
    TranslationRequestBody requestBody = new Gson().fromJson(
            request.getReader(),
            TranslationRequestBody.class
    );
    String originalText = requestBody.getText();
    String languageCode = requestBody.getLanguageCode();

    // Do the translation
    Translate translate = TranslateOptions.getDefaultInstance().getService();
    Translation translation = translate.translate(
            originalText,
            Translate.TranslateOption.targetLanguage(languageCode),
            Translate.TranslateOption.format("html")
    );
    String translatedText = translation.getTranslatedText();

    // Output the translation
    response.setContentType("text/html; charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().println(translatedText);
  }
}