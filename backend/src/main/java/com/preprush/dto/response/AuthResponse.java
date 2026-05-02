package com.preprush.dto.response;

public class AuthResponse {

    private String token;
    private UserPayload user;

    public AuthResponse() {
    }

    public AuthResponse(String token, UserPayload user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserPayload getUser() {
        return user;
    }

    public void setUser(UserPayload user) {
        this.user = user;
    }

    public static class UserPayload {
        private Long id;
        private String name;
        private String email;
        private String academicLevel;
        private String academicDetails;

        public UserPayload() {
        }

        public UserPayload(Long id, String name, String email,
                           String academicLevel, String academicDetails) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.academicLevel = academicLevel;
            this.academicDetails = academicDetails;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAcademicLevel() { return academicLevel; }
        public void setAcademicLevel(String academicLevel) { this.academicLevel = academicLevel; }

        public String getAcademicDetails() { return academicDetails; }
        public void setAcademicDetails(String academicDetails) { this.academicDetails = academicDetails; }
    }
}
