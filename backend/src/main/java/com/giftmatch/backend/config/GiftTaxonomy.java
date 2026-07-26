package com.giftmatch.backend.config;

import java.util.LinkedHashMap;
import java.util.Map;

public final class GiftTaxonomy {
    private static final Map<String, String> NAME_TO_TYPE = createTaxonomy();

    private GiftTaxonomy() {
    }

    public static String typeFor(String giftName) {
        String giftType = NAME_TO_TYPE.get(giftName);
        if (giftType == null) {
            throw new IllegalArgumentException("Nhãn quà AI không hợp lệ: " + giftName);
        }
        return giftType;
    }

    public static Map<String, String> all() {
        return Map.copyOf(NAME_TO_TYPE);
    }

    private static Map<String, String> createTaxonomy() {
        Map<String, String> taxonomy = new LinkedHashMap<>();
        add(taxonomy, "Accessory",
                "Bracelet", "Customized Keychain", "Neck Chain",
                "Sunglasses", "Wallet", "Wrist Watch");
        add(taxonomy, "Book",
                "Fiction Novel", "Motivational Book", "Science Guide", "Self-help Book");
        add(taxonomy, "Electronics",
                "Bluetooth Earbuds", "Fitness Band", "Portable Speaker", "Smart Watch");
        add(taxonomy, "Fashion Item",
                "Cap", "Scarf", "Sling Bag", "Stylish T-shirt");
        add(taxonomy, "Grooming Set",
                "Beard Grooming Kit", "Perfume Set", "Skincare Kit");
        add(taxonomy, "Handmade Craft",
                "Clay Art Pot", "Handcrafted Candle", "Handmade Greeting Card");
        add(taxonomy, "Home Decor",
                "Aroma Diffuser", "LED Table Lamp", "Mini Indoor Plant", "Wall Art Frame");
        add(taxonomy, "Personalized Gift",
                "Customized Photo Frame", "Engraved Pen", "Name Printed Mug");
        add(taxonomy, "Toy",
                "LEGO Set", "Puzzle Game", "Remote Car", "Soft Toy");
        return taxonomy;
    }

    private static void add(
            Map<String, String> taxonomy, String type, String... names
    ) {
        for (String name : names) {
            taxonomy.put(name, type);
        }
    }
}
