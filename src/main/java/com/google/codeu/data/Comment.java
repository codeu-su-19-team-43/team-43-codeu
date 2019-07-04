package com.google.codeu.data;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/** A single comment posted by a user. */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Comment {

  private UUID id;
  private String user;
  private long timestamp;
  private String text;
  private double sentimentScore;

  public Comment(String user, String text) {
    this(UUID.randomUUID(), user, System.currentTimeMillis(), text);
  }

  /**
   * Constructs a new {@link Comment}.
   */
  public Comment(UUID id, String user, long timestamp, String text) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
    this.text = text;
  }
}
