# Ionic Vue Firebase
## Praktikum Pemograman Mobile
### Nabila Winanda Meirani
### H1D022108
### Shift E

## Demo Video
![Demo](2024-11-16%01-24-49.gif)


## Persiapan (Firebase)
1. Buat Project di firebase bernama Vue-firebase
2. Lalu build authentication dengan providers google
3. Tambahkan register app pada project
4. Setelah itu create project ionic, pilih frameword vue

## Penjelasan Kode
1. main.ts
```
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import './theme/variables.css';
import { createPinia } from 'pinia';

const app = createApp(App)
  .use(IonicVue)
  .use(createPinia())
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});

```
file diatas ini berfungsi menginisialisasi Vue dengan Ionic dan Pinia untuk manajemen state, mengatur CSS dasar dari Ionic, dan mengonfigurasi router. aplikasi ini juga dipasang ke elemen HTML setelah router siap.
2. firebase.ts
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
3. auth.ts
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
Di atas ini adalah fungsi yang menggunakan Pinia dan Firebase. Terdapat variabel user untuk menyimpan data pengguna dan isAuth yabg memeriksa status login. Fungsi loginWithGoogle mengimplementasikan login menggunakan Google dan mengarahkan pengguna ke halaman home jika berhasil login, jika gagal, alert ditampilkan. Fungsi logout untuk keluar dari akun, menghapus status autentikasi di Firebase dan Google, dan mengarahkan ke halaman login.
