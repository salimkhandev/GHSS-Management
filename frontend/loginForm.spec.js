// loginForm.spec.js

describe('Login Form', () => {
    beforeEach(() => {
        // Visit the page that contains the LoginForm component
        cy.visit('http://localhost:5173'); // Adjust the URL as needed
    });

    it('should display a welcome message on successful login', () => {
        // Type into the username field
        cy.get('#username').type('testuser');

        // Type into the password field
        cy.get('#password').type('password123');

        // Submit the form (use button click if applicable)
        cy.get('#login-form').submit();
        // Alternatively, use: cy.get('#login-button').click();

        // Verify that the welcome message is displayed
        cy.get('#message').should('be.visible').and('contain.text', 'Welcome, testuser!');
    });

    it('should display an error message on invalid credentials', () => {
        // Type into the username field
        cy.get('#username').type('wronguser');

        // Type into the password field
        cy.get('#password').type('wrongpassword');

        // Submit the form (use button click if applicable)
        cy.get('#login-form').submit();
        // Alternatively, use: cy.get('#login-button').click();

        // Verify that the error message is displayed
        cy.get('#message').should('be.visible').and('contain.text', 'Invalid credentials');
    });
});
