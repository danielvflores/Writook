package com.danielvflores.writook.dto;

public class ApiResponseDTO {

    private boolean success;
    private String message;
    private Object data;

    public ApiResponseDTO(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // GETTERS AND SETTERS FOR ALL FIELDS THIS CLASS IS MUTABLE AND FLEXIBLE.
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }

}
