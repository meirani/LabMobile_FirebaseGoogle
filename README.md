# Ionic Vue Firebase
## Praktikum Pemograman Mobile
### Nabila Winanda Meirani
### H1D022108
### Shift E

## Demo Video

## Persiapan (Firebase)
1. Buat Project di firebase bernama Vue-firebase
2. Lalu build authentication dengan providers google
3. Tambahkan register app pada project
4. Setelah itu create project ionic, pilih frameword vue

## Penjelasan Kode
```
// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDJoN6BtFQw98WnSO2va36mgt3o2WU5Ibc",
    authDomain: "vue-firebase-bb14a.firebaseapp.com",
    projectId: "vue-firebase-bb14a",
    storageBucket: "vue-firebase-bb14a.firebasestorage.app",
    messagingSenderId: "397063020075",
    appId: "1:397063020075:web:0ed8b71df4523d3520d46e",
    measurementId: "G-B7G7HX0X6Y"
  };
  

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
```
Kode diatas ini adalah file untuk integrasi firebase, sesuaikan firebase config dengan data yang ada di project firebase kita
```
export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuth = computed(() => user.value !== null);

    // Sign In with Google
    const loginWithGoogle = async () => {
        try {
            await GoogleAuth.initialize({
                clientId: '',
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
            });

            const googleUser = await GoogleAuth.signIn();

            const idToken = googleUser.authentication.idToken;

            const credential = GoogleAuthProvider.credential(idToken);

            const result = await signInWithCredential(auth, credential);

            user.value = result.user;

            router.push("/home");
        } catch (error) {
            console.error("Google sign-in error:", error);
            
            const alert = await alertController.create({
                header: 'Login Gagal!',
                message: 'Terjadi kesalahan saat login dengan Google. Coba lagi.',
                buttons: ['OK'],
            });

            await alert.present();

            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            await GoogleAuth.signOut();
            user.value = null;
            router.replace("/login");
        } catch (error) {
            console.error("Sign-out error:", error);
            throw error;
        }
    };

    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
    });

    return { user, isAuth, loginWithGoogle, logout };
});
```
