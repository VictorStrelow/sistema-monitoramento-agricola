package com.ctw.monitoramentoagricola.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EstufaDTO(
        BigDecimal temperatura,
        BigDecimal umidade,
        BigDecimal pressao,
        Integer presenca,
        Integer distancia,
        Integer luminosidade,
        Integer temp_solo,
        LocalDateTime dataHora
) {}
