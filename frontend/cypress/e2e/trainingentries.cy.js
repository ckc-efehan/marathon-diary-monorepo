describe('TrainingEntries E2E', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads the page', () => {
        cy.contains('Meine Trainingsseite');
    });

    it('adds a new training entry', () => {
        cy.get('input[placeholder="Ziel-Zeit"]').type('10');
        cy.get('input[placeholder="Ziel-Kilometer"]').type('10');
        cy.get('input[placeholder="Gelaufene Kilometer"]').type('10');
        cy.get('input[placeholder="Gelaufene Zeit"]').type('10');
        cy.contains('Senden').click();

        cy.contains('Trainingsübersicht');
        cy.contains('Ziel-Zeit: 10 h', {timeout: 10000});
        cy.contains('Ziel-Kilometer: 10 km', {timeout: 10000});
        cy.contains('Gelaufene Kilometer: 10 km', {timeout: 10000});
        cy.contains('Benötigte Zeit: 10 h', {timeout: 10000});
        cy.contains('Ziel erreicht: Ja', {timeout: 10000});
    });

    it('deletes a training entry', () => {
        // Assuming there's already an entry
        cy.contains('Löschen', {timeout: 10000}).click();
        cy.contains('Keine Einträge vorhanden.', {timeout: 10000});
    });
});