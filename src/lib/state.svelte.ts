import { authClient } from './auth-client';

class AppState {
	isGuestMode = $state(false);

	setGuestMode(value: boolean) {
		this.isGuestMode = value;
	}
}

export const appState = new AppState();
