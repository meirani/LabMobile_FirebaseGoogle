# Ionic Vue Firebase
## Praktikum Pemograman Mobile
### Nabila Winanda Meirani
### H1D022108
### Shift E

## Demo Video
![Demo](2024-11-16%01-24-49.gif)
###### (jika video tidak muncul, liat file 2024-11-16 01-24-49.gif pada repository)


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


4. file tampilan halaman

LoginPage.vue: ini adalah file untuk tampilan halaman login, halaman login berisi tulisan "Praktikum Pemograman Mobile" dan juga satu button untuk login menggunakan google

TabsMenu.vue: ini adalah file yang berada di folder components, file ini untuk membuat navigasi menu yang berisi dua icon untuk mengarahkan ke halaman home dan profile

HomePage.vue: ini adalah halaman home yang akan muncul pertama kali saat user berhasil login, halaman ini hanya kosong saja dengan title home

ProfilePage.vue: merupakan halaman profile yang menampilkan informasi nama dan email user, halaman ini juga mengambil dan menampilkan foto profile user, terdapat button untuk logout yang berfungsi untuk keluar dari akun.
```
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
    authStore.logout();
};

const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
    userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
```


5. index.ts
```
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      isAuth: false,
    },
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: {
      isAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: {
      isAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.user === null) {
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        resolve();
        unsubscribe();
      });
    });
  }

  if (to.path === '/login' && authStore.isAuth) {
    next('/home');
  } else if (to.meta.isAuth && !authStore.isAuth) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```
Kode di atas adalah konfigurasi untuk routing menggunakan Vue Router dan Ionic Vue. Ada beberapa path  /login, /home, dan /profile, dengan isAuth untuk yang mengecek apakah halaman tersebut perlu autentikasi atau tidak. hanya halaman /login yang ditujukan untuk user yg belum autentikasi, sedangkan /home dan /profile untuk user yang sudah login.
yang memeriksa status login pengguna adalah fungsi `beforeEach`. 


## Kesimpulan
Aplikasi ini menggunakan Firebase dan Pinia untuk autentikasi dengan akun Google. Prosesnya pengguna login dengan Google melalui loginWithGoogle(), yang menginisialisasi autentikasi Google dan meminta token dari akun pengguna. Token ini digunakan untuk membuat kredensial Firebase dan mengautentikasi pengguna ke aplikasi. Setelah berhasil login, data pengguna (seperti username) disimpan di state Pinia untuk digunakan di seluruh aplikasi. Dengan status autentikasi yang diperbarui, aplikasi dapat mengarahkan pengguna ke halaman beranda atau profil mereka, yang menunjukkan informasi seperti username dan detail profil yang terkait dengan akun Google mereka.
