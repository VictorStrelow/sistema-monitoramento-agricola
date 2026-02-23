package com.ctw.monitoramentoagricola.service;

import com.ctw.monitoramentoagricola.dto.EstufaDTO;
import com.ctw.monitoramentoagricola.model.Estufa;
import com.ctw.monitoramentoagricola.repository.EstufaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstufaService {

    @Autowired
    private EstufaRepository repository;

    // Converte a entidade para DTO com segurança para nulos
    private EstufaDTO toDTO(Estufa e) {
        return new EstufaDTO(
                e.getTemperatura() != null ? e.getTemperatura() : BigDecimal.ZERO,
                e.getUmidade() != null ? e.getUmidade() : BigDecimal.ZERO,
                e.getPressao() != null ? e.getPressao() : BigDecimal.ZERO,
                e.getPresenca() != null ? e.getPresenca() : 0,
                e.getDistancia() != null ? e.getDistancia() : 0,
                e.getLuminosidade() != null ? e.getLuminosidade() : 0,
                e.getTemp_solo() != null ? e.getTemp_solo() : 0,
                e.getDataHora() != null ? e.getDataHora() : LocalDateTime.now()
        );
    }

    public EstufaDTO getUltimaLeitura() {
        Optional<Estufa> optionalEstufa = repository.findTopByOrderByIdDesc();

        return optionalEstufa.map(this::toDTO)
                .orElse(new EstufaDTO(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0, 0, 0, 0, LocalDateTime.now()));
    }

    public List<EstufaDTO> getHistorico() {
        List<Estufa> registros = repository.findUltimosRegistros();
        if (registros == null || registros.isEmpty()) {
            return Collections.emptyList();
        }
        return registros.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
