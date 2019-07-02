package com.google.codeu;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class Util {

  static final int DEFAULT_IMAGE_COUNT = 10;

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

  /**  Toggle the existence of a string in a list. */
  public static List<String> toggleStringInList(List<String> list, String element) {
    if (list.contains(element)) {
      list.remove(element);
    } else {
      list.add(element);
    }
    return list;
  }

  /**  Get the url of the default profile image. */
  public static String getDefaultProfileImageUrl() {
    return "./images/default-user-profile/"
        + (int)(Math.random() * (DEFAULT_IMAGE_COUNT - 1) + 1) + ".jpg";
  }
}
