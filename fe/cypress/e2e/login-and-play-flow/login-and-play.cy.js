/// <reference types="cypress" />
import * as user from '../../fixtures/credentials.json';

describe('Login, play, and logout', () => {
  it('should work', () => {
    cy.visit('http://localhost:3000');
    localStorage.clear();
    cy.get('[name=username]').type(`${user.username}`);
    cy.get('[name=password]').type(`${user.password}{enter}`);
    cy.get('[data-test=username]').should('have.text', 'rebecka');
    cy.get('[data-test=logout]').click();
    cy.get('button').should('contain', 'Login');
  });
});
