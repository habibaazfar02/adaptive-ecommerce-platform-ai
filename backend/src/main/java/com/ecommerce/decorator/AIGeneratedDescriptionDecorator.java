package com.ecommerce.decorator;

public class AIGeneratedDescriptionDecorator implements ProductDecorator {
  @Override public String name(){ return "AIGeneratedDescriptionDecorator"; }

  @Override
  public ProductView apply(ProductView view) {
    // Simple “AI-style” description (replace with TF.js or real model later)
    if (view.description == null || view.description.isBlank()) {
      view.description = "Smart pick: " + view.name + " curated based on trending customer interest.";
    } else {
      view.description = view.description + " (AI tip: Great value based on current demand.)";
    }
    return view;
  }
}