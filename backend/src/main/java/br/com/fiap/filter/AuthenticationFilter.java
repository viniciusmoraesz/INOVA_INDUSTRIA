package br.com.fiap.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import br.com.fiap.config.EnvConfig;

import java.io.IOException;
import java.security.Principal;

//@Secured
@Provider  // Re-enabled
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    // Using the same secret key as in TokenService.java
    private static final String SECRET_KEY = EnvConfig.getJwtSecret();
    private static final String REALM = "inova-industria";
    private static final String AUTHENTICATION_SCHEME = "Bearer";
    private final Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Skip authentication for login endpoint and OPTIONS requests
        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod();
        System.out.println("Filter checking path: " + path + " method: " + method);

        // Skip authentication for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(method)) {
            System.out.println("Skipping authentication for OPTIONS request");
            return;
        }

        // More comprehensive path matching for login endpoint
        if (path.equals("auth/login") ||
                path.equals("/auth/login") ||
                path.startsWith("auth/login") ||
                path.endsWith("/auth/login") ||
                path.contains("auth/login")) {
            System.out.println("Skipping authentication for login endpoint");
            return; // Allow login requests without authentication
        }

        System.out.println("Applying authentication filter");
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (!isTokenBasedAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();

        try {
            DecodedJWT decodedJWT = validateToken(token);

            // Set the security context with the authenticated user
            final String subject = decodedJWT.getSubject();
            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() {
                    return () -> subject;
                }

                @Override
                public boolean isUserInRole(String role) {
                    // You can implement role-based access control here if needed
                    return true;
                }

                @Override
                public boolean isSecure() {
                    return requestContext.getSecurityContext().isSecure();
                }

                @Override
                public String getAuthenticationScheme() {
                    return AUTHENTICATION_SCHEME;
                }
            });

        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            abortWithUnauthorized(requestContext);
        }
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE,
                                AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
                        .build());
    }

    private DecodedJWT validateToken(String token) throws Exception {
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("inova-industria-api")  // Mesmo emissor usado no TokenService
                .build();
        return verifier.verify(token);
    }
}