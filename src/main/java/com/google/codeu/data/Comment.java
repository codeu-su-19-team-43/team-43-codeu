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

  public Comment(String user, String text) {
    this(UUID.randomUUID(), user, System.currentTimeMillis(), text);
  }
}
