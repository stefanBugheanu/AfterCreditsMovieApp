    package com.backend.auth;

    import com.backend.config.JwtService;
    import com.backend.entities.User;
    import com.backend.entities.enums.RoleEnum;
    import com.backend.repositories.UserRepository;
    import lombok.RequiredArgsConstructor;
    import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    public class AuthenticationService {

        private final UserRepository repository;

        private final PasswordEncoder passwordEncoder;

        private final JwtService jwtService;

        private final AuthenticationManager authManager;
        public LoginResponse register(RegisterRequest request){
            var user= User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(RoleEnum.USER)
                    .build();
            repository.save(user);

            var jwtToken = jwtService.generateToken(user);

            return LoginResponse.builder()
                    .token(jwtToken)
                    .build();
        }

        public LoginResponse login (LoginRequest request){
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            var user= repository.findByUsername(request.getUsername())
                    .orElseThrow();

            var jwtToken = jwtService.generateToken(user);

            return LoginResponse.builder()
                    .token(jwtToken)
                    .build();

        }
    }
