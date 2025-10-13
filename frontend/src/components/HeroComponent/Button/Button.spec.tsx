import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

let buttonNames: string[];

beforeAll(() =>  {
    buttonNames = ["Pets Please", "Event Hunting"];
})


test('renders initial button on DOM', () => {
    const mockOnClick = jest.fn();

    buttonNames.forEach((name) => {
        const {getByText} = render(<Button text={name} onClick={mockOnClick}/>);
        
        const button = getByText(name);
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledWith(name);
    })
})