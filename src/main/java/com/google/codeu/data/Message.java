/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.codeu.data;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/** A single message posted by a user. */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Message {

  private UUID id;
  private String user;
  private long timestamp;
  private String text;
  private String imageUrl;

  private List<String> imageLabels;
  private String imageLandmark;
  private double imageLat;
  private double imageLong;
  private double sentimentScore;

  private List<UUID> commentIds;
  private List<String> favouritedUserEmails;

  /**
   * Constructs a new {@link Message} posted by {@code user} with {@code text}. 
   * Generates a random ID and uses the current system 
   * time for the creation time.
   */
  public Message(String user, String text) {
    this(UUID.randomUUID(), user, System.currentTimeMillis(), text);
  }

  /**
   * Constructs a new {@link Message}.
   */
  public Message(UUID id, String user, long timestamp, String text) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
    this.text = text;
  }

  /**
   * Converts list of comment IDs as strings to list of comment IDs as UUIDs.
   */
  public List<UUID> convertStringsToUUIDs(List<String> UUIDStrings) {

    if (UUIDStrings == null) {
      return null;
    }
    return UUIDStrings.stream().map(UUID::fromString).collect(Collectors.toList());
  }

  /**
   * Converts list of comment IDs as UUIDs to list of comment IDs as strings.
   */
  public List<String> convertUUIDsToStrings(List<UUID> UUIDs) {

    if (UUIDs == null) {
      return null;
    }
    return UUIDs.stream().map(UUID::toString).collect(Collectors.toList());
  }
}
