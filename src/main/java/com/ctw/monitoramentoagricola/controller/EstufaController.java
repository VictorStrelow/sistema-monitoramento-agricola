package com.ctw.monitoramentoagricola.controller;

import com.ctw.monitoramentoagricola.dto.EstufaDTO;
import com.ctw.monitoramentoagricola.service.EstufaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estufa")
@CrossOrigin(origins = "*") // Permite chamadas de qualquer origem (essencial para o front)
public class EstufaController {

    @Autowired
    private EstufaService service;

    @GetMapping("/{id}")
    public ResponseEntity<EstufaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/atual")
    public ResponseEntity<EstufaDTO> getAtual() {
        EstufaDTO dados = service.getUltimaLeitura();
        return ResponseEntity.ok(dados);
    }

    @GetMapping("/historico")
    public ResponseEntity<List<EstufaDTO>> getHistorico() {
        List<EstufaDTO> historico = service.getHistorico();
        return ResponseEntity.ok(historico);
    }
}
