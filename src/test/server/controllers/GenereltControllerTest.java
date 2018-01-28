package server.controllers;

import org.junit.Assert;
import org.junit.Test;

public class GenereltControllerTest {
    @Test
    public void getString() throws Exception {
        Assert.assertEquals("Scrumgruppa", GenereltController.getString("navn", "husholdning", 1));
    }
}