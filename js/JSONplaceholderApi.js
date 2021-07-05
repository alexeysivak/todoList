class JSONplaceholderApi {
	constructor() {
		this.BASE_TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';
		this.TEST_USER_ID = 'userId=1';
	}

	getData() {
		return fetch(`${this.BASE_TODOS_URL}?${this.TEST_USER_ID}`)
			.then((response) => response.json())
			.catch((error) => {
				console.error(error);
			});
	}

	saveNewData(userInput) {
		const options = {
			method: 'POST',
			body: JSON.stringify({
				id: '',
				title: userInput,
				completed: false,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		};

		return fetch(this.BASE_TODOS_URL, options)
			.then((response) => response.json())
			.catch((error) => {
				console.error(error);
			});
	}

	deleteData(targetId) {
		fetch(`${this.BASE_TODOS_URL}/${targetId}`, {
			method: 'DELETE',
		}).catch((error) => {
			console.error(error);
		});
	}

	changeData(todoToChange) {
		const options = {
			method: 'PUT',
			body: JSON.stringify(todoToChange),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		};

		fetch(`${this.BASE_TODOS_URL}/${todoToChange.id}`, options)
			.then((response) => response.json())
			.catch((error) => {
				console.error(error);
			});
	}
}

const placeholderApi = new JSONplaceholderApi();

export default placeholderApi;
