import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TrainingEntries from '@/components/TrainingEntries.vue';
import axios from 'axios';

// Mock Axios
vi.mock('axios');

const backendUrl = import.meta.env.VITE_BACKEND_URL + '/entries';

describe('TrainingEntries.vue', () => {
    it('should fetch entries on created', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true },
            { id: 2, date: '2024-06-29', targetTime: 2, targetKilometre: 10, kilometreRan: 8, timeRan: 2, goalReached: false },
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        expect(axios.get).toHaveBeenCalledWith(backendUrl);
        expect(wrapper.vm.trainingEntries).toEqual(mockEntries);
    });

    it('should submit a new entry', async () => {
        axios.post.mockResolvedValue({});
        axios.get.mockResolvedValue({ data: [] });  // reset fetchEntries call

        const wrapper = mount(TrainingEntries);
        wrapper.setData({
            zielZeit: '1',
            zielKilometer: '5',
            gelaufeneKilometer: '5',
            gelaufeneZeit: '1'
        });

        await wrapper.find('button').trigger('click');
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        expect(axios.post).toHaveBeenCalledWith(backendUrl, {
            date: wrapper.vm.getCurrentDate(),
            targetTime: 1,
            targetKilometre: 5,
            kilometreRan: 5,
            timeRan: 1,
            goalReached: true
        });
    });

    it('should edit an entry', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true }
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        await wrapper.find('.edit').trigger('click');
        wrapper.setData({
            zielZeit: '2',
            zielKilometer: '10',
            gelaufeneKilometer: '8',
            gelaufeneZeit: '2'
        });
        await wrapper.find('button').trigger('click');
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        expect(axios.put).toHaveBeenCalledWith(`${backendUrl}/1`, {
            date: '2024-06-28',
            targetTime: 2,
            targetKilometre: 10,
            kilometreRan: 8,
            timeRan: 2,
            goalReached: false
        });
    });

    it('should delete an entry', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true }
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        await wrapper.find('.delete').trigger('click');
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        expect(axios.delete).toHaveBeenCalledWith(`${backendUrl}/1`);
    });

    it('should compute correct totalDistance', () => {
        const wrapper = mount(TrainingEntries);
        wrapper.setData({
            trainingEntries: [
                { timeRan: 5 },
                { timeRan: 2 },
                { timeRan: 3 }
            ]
        });

        expect(wrapper.vm.totalTime).toBe('10.00');
    });

    it('should compute correct totalDistance', () => {
        const wrapper = mount(TrainingEntries);
        wrapper.setData({
            trainingEntries: [
                { kilometreRan: 1 },
                { kilometreRan: 2 },
                { kilometreRan: 3 }
            ]
        });

        expect(wrapper.vm.totalDistance).toBe('6.00');
    });

    it('should compute correct goalAchievementRate', () => {
        const wrapper = mount(TrainingEntries);
        wrapper.setData({
            trainingEntries: [
                { goalReached: true },
                { goalReached: false },
                { goalReached: true }
            ]
        });

        expect(wrapper.vm.goalAchievementRate).toBe('66.67');
    });

    it('should filter entries by goalReached', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true },
            { id: 2, date: '2024-06-29', targetTime: 2, targetKilometre: 10, kilometreRan: 8, timeRan: 2, goalReached: false },
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        // Filtere nach Zielen, die erreicht wurden
        await wrapper.setData({ filterGoalReached: 'true' });
        expect(wrapper.vm.filteredEntries.length).toBe(1);
        expect(wrapper.vm.filteredEntries[0].goalReached).toBe(true);

        // Filtere nach Zielen, die nicht erreicht wurden
        await wrapper.setData({ filterGoalReached: 'false' });
        expect(wrapper.vm.filteredEntries.length).toBe(1);
        expect(wrapper.vm.filteredEntries[0].goalReached).toBe(false);

        // Filtere nach allen Zielen
        await wrapper.setData({ filterGoalReached: 'all' });
        expect(wrapper.vm.filteredEntries.length).toBe(2);
    });

    it('should sort entries by date', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true },
            { id: 2, date: '2024-06-27', targetTime: 2, targetKilometre: 10, kilometreRan: 8, timeRan: 2, goalReached: false },
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        // Sortiere nach absteigendem Datum
        await wrapper.setData({ sortDate: 'desc' });
        wrapper.vm.sortEntries();
        expect(wrapper.vm.sortedEntries[0].date).toBe('2024-06-28');
        expect(wrapper.vm.sortedEntries[1].date).toBe('2024-06-27');

        // Sortiere nach aufsteigendem Datum
        await wrapper.setData({ sortDate: 'asc' });
        wrapper.vm.sortEntries();
        expect(wrapper.vm.sortedEntries[0].date).toBe('2024-06-27');
        expect(wrapper.vm.sortedEntries[1].date).toBe('2024-06-28');
    });

    it('should filter by goalReached and sort by date', async () => {
        const mockEntries = [
            { id: 1, date: '2024-06-28', targetTime: 1, targetKilometre: 5, kilometreRan: 5, timeRan: 1, goalReached: true },
            { id: 2, date: '2024-06-27', targetTime: 2, targetKilometre: 10, kilometreRan: 8, timeRan: 2, goalReached: false },
            { id: 3, date: '2024-06-26', targetTime: 1.5, targetKilometre: 6, kilometreRan: 6, timeRan: 1.5, goalReached: true }
        ];
        axios.get.mockResolvedValue({ data: mockEntries });

        const wrapper = mount(TrainingEntries);
        await wrapper.vm.fetchEntries();  // Manuell die fetchEntries Methode aufrufen

        // Filtere nach Zielen, die erreicht wurden und sortiere nach aufsteigendem Datum
        await wrapper.setData({ filterGoalReached: 'true', sortDate: 'asc' });
        wrapper.vm.sortEntries();
        expect(wrapper.vm.sortedEntries.length).toBe(2);
        expect(wrapper.vm.sortedEntries[0].date).toBe('2024-06-26');
        expect(wrapper.vm.sortedEntries[1].date).toBe('2024-06-28');

        // Filtere nach Zielen, die erreicht wurden und sortiere nach absteigendem Datum
        await wrapper.setData({ sortDate: 'desc' });
        wrapper.vm.sortEntries();
        expect(wrapper.vm.sortedEntries.length).toBe(2);
        expect(wrapper.vm.sortedEntries[0].date).toBe('2024-06-28');
        expect(wrapper.vm.sortedEntries[1].date).toBe('2024-06-26');
    });
});
