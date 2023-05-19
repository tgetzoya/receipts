package net.getzoyan.receipts.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String name, Long id) {
        super("Could not find item in " + name + " with id " + id);
    }
}
