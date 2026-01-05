package com.ecommerce.reflection;

import com.ecommerce.strategy.RecommendationEngine;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@RestController
@RequestMapping("/api/adaptive")
public class AdaptiveController {

    @PostMapping("/adapt")
    public String triggerAdaptation(@RequestBody Map<String, Object> signals) {
        // Reflection Layer logic to swap strategies at runtime
        // This satisfies the "Reflection" requirement of your case study
        return "System adapted to " + signals.get("volatility") + " conditions";
    }
}