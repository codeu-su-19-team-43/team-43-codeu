package com.google.codeu.servlets;

import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;

import com.google.gson.Gson;
import com.google.protobuf.ByteString;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

/**
 * Takes request that contains text and responds with an MP3 file speaking that text.
 */
@WebServlet("/a11y/tts")
public class TextToSpeechServlet extends HttpServlet {

  private TextToSpeechClient ttsClient;

  private class TextToSpeechRequestBody {
    String text;

    public String getText() {
      return text;
    }

    public void setText(String text) {
      this.text = text;
    }
  }

  @Override
  public void init() {
    try {
      ttsClient = TextToSpeechClient.create();
    } catch (IOException e) {
      System.out.println("Error in creating TextToSpeechClient.");
    }
  }

  /**
   * Responds with an MP3 byte stream from the Google Cloud Text-to-Speech API.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    TextToSpeechRequestBody requestBody = new Gson().fromJson(
            request.getReader(),
            TextToSpeechRequestBody.class
    );
    String text = Jsoup.clean(requestBody.getText(), Whitelist.none());

    // Set the text input to be synthesized
    SynthesisInput input = SynthesisInput.newBuilder()
            .setText(text)
            .build();

    // Build the voice request, select the language code ("en-US") and the SSML voice gender
    VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
            .setLanguageCode("en-US")
            .setSsmlGender(SsmlVoiceGender.NEUTRAL)
            .build();

    // Select the type of audio file to return
    AudioConfig audioConfig = AudioConfig.newBuilder()
            .setAudioEncoding(AudioEncoding.MP3)
            .build();

    // Perform the text-to-speech request on the text input with the selected voice parameters and
    // audio file type.
    SynthesizeSpeechResponse synthesizeSpeechResponse = ttsClient.synthesizeSpeech(
            input, voice, audioConfig
    );

    // Get audio content from the API response.
    ByteString audioContents = synthesizeSpeechResponse.getAudioContent();

    // Set audio content for servlet response.
    response.setContentType("audio/mpeg");
    try (
            ServletOutputStream output = response.getOutputStream();
            InputStream audioInput = audioContents.newInput()
    ) {
      byte[] buffer = new byte[2048];
      int bytesRead;
      while ((bytesRead = audioInput.read(buffer)) != -1) {
        output.write(buffer, 0, bytesRead);
      }
    }
  }
}
