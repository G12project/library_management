import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import { ListGroup, Button, Container, ListGroupItem , Table} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';


function ShowList({ book, setx, x, addToast }) {
	return (
		<ListGroupItem>
			<Table>
				<tbody>
				<tr><td><strong>{book.title}</strong></td>
				<td>User: {book.user}</td></tr>
				<tr>
					<td> Isbn: {book.isbn_no}</td>
					<td>Due: {book.due_date}</td></tr>
				<tr>
					<td>Copy: {book.copy_no}</td>
					<td>
					<Button outline color="success" onClick={() => {
							fetch('/homedata/return/' + book.isbn_no+'/'+book.copy_no).then(response =>
								response.json().then((res) => {
									console.log(res.message)
									addToast(res.message, {
										appearance: 'info',
										autoDismiss: true,
										autoDismissTimeout: 8000,
										placement: 'bottom-left'
									})
									setx(!x);
								})
							)
					}}>Return</Button></td>
				</tr>
			</tbody>
			</Table>
		</ListGroupItem>


	);
};

export const LibReturn = (props) => {
	const [loans, setloans] = useState(null);
	const [x, setx] = useState(false);
	const { addToast }=useToasts();
	useEffect(() => {
		let mounted = true;
		fetch('/borrow').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.loans);
				if (mounted) {
					setloans(data.loans);

				}
			})
		);

		return function cleanup() {
			mounted = false;
		}
	}, [x]);
	if (loans) {
		const loanlist = loans.map((book) => {
			return (
				<ShowList book={book}  x={x} setx={setx} addToast={addToast}/>
			)
		});
		return (
			<ListGroup>
				{loanlist}
			</ListGroup>
		);
	}
	else {
		return null
	}
}