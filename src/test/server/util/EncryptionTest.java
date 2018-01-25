package server.util;

import org.junit.Test;

import static org.junit.Assert.*;

public class EncryptionTest {
    @Test
    public void isPassOk() throws Exception {
        assertTrue(Encryption.instance.isPassOk("1234", "9whkVNhshREsdfYKwAMbcg==", "0MPc1V3GVhFkOkQwVHKqGA=="));
    }
}