package br.com.fiap.service;

import br.com.fiap.config.EnvConfig;
import br.com.fiap.model.Cliente;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class TokenService {

    private static final String SECRET_KEY = EnvConfig.getJwtSecret();
    private static final int EXPIRATION_HOURS = EnvConfig.getJwtExpirationHours();
    private final Algorithm algorithm;

    public TokenService() {
        this.algorithm = Algorithm.HMAC256(SECRET_KEY);
        
        // Log de segurança (sem expor a chave)
        if (SECRET_KEY.equals("default-secret-key-change-in-production")) {
            System.err.println("⚠️ AVISO: Usando chave JWT padrão! Configure JWT_SECRET em produção!");
        }
    }

    public String generateToken(Cliente cliente) {
        try {
            Instant now = Instant.now();
            Instant expiresAt = now.plus(EXPIRATION_HOURS, ChronoUnit.HOURS);

            return JWT.create()
                    .withIssuer("inova-industria-api")
                    .withSubject(cliente.getIdCliente().toString())
                    .withClaim("role", cliente.getRole())
                    .withClaim("empresaId", cliente.getIdEmpresa()) // Will be null for SUPER_ADMIN
                    .withIssuedAt(now)
                    .withExpiresAt(expiresAt)
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            // Invalid Signing configuration / Couldn't convert Claims.
            throw new RuntimeException("Error while generating token", exception);
        }
    }
}