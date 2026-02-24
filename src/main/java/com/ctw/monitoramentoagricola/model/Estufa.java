package com.ctw.monitoramentoagricola.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leitura_estufa") // Nome exato do seu banco
public class Estufa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "temperatura", precision = 5, scale = 2)
    private BigDecimal temperatura;

    @Column(name = "umidade", precision = 5, scale = 2)
    private BigDecimal umidade;

    @Column(name = "pressao", precision = 10, scale = 2)
    private BigDecimal pressao;

    @Column(name = "presenca")
    private Integer presenca;

    @Column(name = "distancia")
    private Integer distancia;

    @Column(name = "luminosidade")
    private Integer luminosidade;

    @Column(name = "temp_solo")
    private Integer tempSolo; // Mapeado manualmente para a coluna temp_solo

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    // Construtor vazio para o JPA
    public Estufa() {}

    public Estufa(Long id, BigDecimal temperatura, BigDecimal umidade, BigDecimal pressao, Integer presenca, Integer distancia, Integer luminosidade, Integer tempSolo, LocalDateTime dataHora) {
        this.id = id;
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this.presenca = presenca;
        this.distancia = distancia;
        this.luminosidade = luminosidade;
        this.tempSolo = tempSolo;
        this.dataHora = dataHora;
    }

    public Estufa(BigDecimal temperatura, BigDecimal umidade, BigDecimal pressao, Integer presenca, Integer distancia, Integer luminosidade, Integer tempSolo, LocalDateTime dataHora) {
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this.presenca = presenca;
        this.distancia = distancia;
        this.luminosidade = luminosidade;
        this.tempSolo = tempSolo;
        this.dataHora = dataHora;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getTemperatura() { return temperatura; }
    public void setTemperatura(BigDecimal temperatura) { this.temperatura = temperatura; }

    public BigDecimal getUmidade() { return umidade; }
    public void setUmidade(BigDecimal umidade) { this.umidade = umidade; }

    public BigDecimal getPressao() { return pressao; }
    public void setPressao(BigDecimal pressao) { this.pressao = pressao; }

    public Integer getPresenca() { return presenca; }
    public void setPresenca(Integer presenca) { this.presenca = presenca; }

    public Integer getDistancia() { return distancia; }
    public void setDistancia(Integer distancia) { this.distancia = distancia; }

    public Integer getLuminosidade() { return luminosidade; }
    public void setLuminosidade(Integer luminosidade) { this.luminosidade = luminosidade; }

    public Integer getTempSolo() { return tempSolo; }
    public void setTempSolo(Integer tempSolo) { this.tempSolo = tempSolo; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
}