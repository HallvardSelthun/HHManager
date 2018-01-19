package server.controllers;

import org.junit.Test;

import static org.junit.Assert.*;

public class GenereltControllerTest {
    @Test
    public void getString() throws Exception {
        assertEquals("Scrumgruppa", GenereltController.getString("navn", "husholdning", 1));
    }
}