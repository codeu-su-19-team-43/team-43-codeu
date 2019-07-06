package com.google.codeu;

import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.cloud.translate.Language;
import com.google.cloud.translate.TranslateOptions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class Util {

  public static final int DEFAULT_IMAGE_COUNT = 10;
  public static final String DEFAULT_LANG_CODE_FOR_TRANSLATION = "es";

  private static final List<String> VALID_LANGUAGE_CODES = getValidTranslationLangCodes();

  /**
   * Returns a list with valid language translation codes for Google Cloud Translation.
   */
  private static List<String> getValidTranslationLangCodes() {
    List<Language> supportedLanguages = TranslateOptions.getDefaultInstance().getService()
            .listSupportedLanguages();

    List<String> validLanguageCodes = new ArrayList<>();
    for (Language lang: supportedLanguages) {
      validLanguageCodes.add(lang.getCode());
    }

    return validLanguageCodes;
  }

  /**
   * Converts list of favourite IDs as strings to list of favourite IDs as UUIDs.
   */
  public static List<UUID> convertStringsToUuids(List<String> uuidStrings) {
    if (uuidStrings == null) {
      return null;
    }
    return uuidStrings.stream().map(UUID::fromString).collect(Collectors.toList());
  }

  /**
   * Converts list of favourite IDs as UUIDs to list of favourite IDs as strings.
   */
  public static List<String> convertUuidsToStrings(List<UUID> uuids) {
    if (uuids == null) {
      return null;
    }
    return uuids.stream().map(UUID::toString).collect(Collectors.toList());
  }

  /**
   * Toggle the existence of a string in a list.
   */
  public static List<String> toggleStringInList(List<String> list, String element) {
    if (list.contains(element)) {
      list.remove(element);
    } else {
      list.add(element);
    }
    return list;
  }

  /**
   * Get the url of the default profile image.
   */
  public static String getDefaultProfileImageUrl() {
    return "./images/default-user-profile/"
        + (int)(Math.random() * (DEFAULT_IMAGE_COUNT - 1) + 1) + ".jpg";
  }

  /**
   * Check if string is a valid language code for Google Cloud Translation.
   */
  public static boolean checkIfValidLanguageCode(String langCode) {
    return VALID_LANGUAGE_CODES.contains(langCode);
  }

  /**
   * Analyse sentiment of text and return the sentiment score.
   */
  public static double getSentimentScoreOfText(String rawUserText) throws IOException {
    // Set text for sentiment analysis.
    Document doc = Document.newBuilder().setContent(rawUserText)
            .setType(Document.Type.HTML).build();

    // Perform sentiment analysis.
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    double sentimentScore = sentiment.getScore();
    languageService.close();

    return sentimentScore;
  }
}
