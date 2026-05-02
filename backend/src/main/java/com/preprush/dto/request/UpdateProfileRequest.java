package com.preprush.dto.request;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String academicLevel;

    @Size(max = 255)
    private String academicDetails;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(String academicLevel) { this.academicLevel = academicLevel; }

    public String getAcademicDetails() { return academicDetails; }
    public void setAcademicDetails(String academicDetails) { this.academicDetails = academicDetails; }
}
