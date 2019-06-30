package com.google.codeu;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class Util {

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
}
