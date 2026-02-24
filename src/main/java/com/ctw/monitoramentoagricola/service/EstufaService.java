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

    // Converte Entidade para DTO com tratamento de NULOS
    private EstufaDTO toDTO(Estufa e) {
        return new EstufaDTO(
                e.getId() != null ? e.getId() : 0L,
                e.getTemperatura() != null ? e.getTemperatura() : BigDecimal.ZERO,
                e.getUmidade() != null ? e.getUmidade() : BigDecimal.ZERO,
                e.getPressao() != null ? e.getPressao() : BigDecimal.ZERO,
                e.getPresenca() != null ? e.getPresenca() : 0,
                e.getDistancia() != null ? e.getDistancia() : 0,
                e.getLuminosidade() != null ? e.getLuminosidade() : 0,
                e.getTempSolo() != null ? e.getTempSolo() : 0,
                e.getDataHora() != null ? e.getDataHora() : LocalDateTime.now()
        );
    }

    public EstufaDTO getById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado com ID: " + id));
    }

    public EstufaDTO getUltimaLeitura() {
        // Busca o dado mais recente usando a query robusta que criamos
        Optional<Estufa> optionalEstufa = repository.findMelhorRegistroRecente();

        return optionalEstufa.map(this::toDTO)
                .orElse(new EstufaDTO(0L, BigDecimal.ZERO, BigDecimal.ZERO,
                        BigDecimal.ZERO, 0, 0, 0, 0, LocalDateTime.now()));
    }

    public List<EstufaDTO> getHistorico() {
        Optional<Estufa> registros = repository.findMelhorRegistroRecente();
        if (registros == null || registros.isEmpty()) {
            return Collections.emptyList();
        }
        return registros.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
