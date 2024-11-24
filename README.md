# Ionic Vue Firebase
## Praktikum Pemograman Mobile
#### Nabila Winanda Meirani
#### H1D022108
#### Shift E
#### Login google dan CRUD dengan Firebase

## Demo Video
![Demo](DemoVideoCRUD.gif)
###### (jika video tidak muncul, liat file DemoVideoCRUD.gif pada repository)

# Login Google 

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
yang memeriksa status login pengguna adalah fungsi beforeEach. 


## Kesimpulan
Aplikasi ini menggunakan Firebase dan Pinia untuk autentikasi dengan akun Google. Prosesnya pengguna login dengan Google melalui loginWithGoogle(), yang menginisialisasi autentikasi Google dan meminta token dari akun pengguna. Token ini digunakan untuk membuat kredensial Firebase dan mengautentikasi pengguna ke aplikasi. Setelah berhasil login, data pengguna (seperti username) disimpan di state Pinia untuk digunakan di seluruh aplikasi. Dengan status autentikasi yang diperbarui, aplikasi dapat mengarahkan pengguna ke halaman beranda atau profil mereka, yang menunjukkan informasi seperti username dan detail profil yang terkait dengan akun Google mereka.

# CRUD

## Persiapan (Firebase)
1. Pada project Vue-firebase pergi ke Database Firestore
2. Buatlah Database untuk menampung CRUD ini
3. Deklarasikan db pada file firestore.ts

## Penjelasan Kode
1. firestore.ts
```
// interface data
export interface Todo {
    id?: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// operasi CRUD
export const firestoreService = {
    // get collection ref
    getTodoRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'todos');
    },

		// create
    async addTodo(todo: Omit<Todo, 'id'>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = await addDoc(todoRef, {
                ...todo,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Todo:', error);
            throw error;
        }
    },

		// read
    async getTodos(): Promise<Todo[]> {
        try {
            const todoRef = this.getTodoRef();
            const q = query(todoRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Todo));
        } catch (error) {
            console.error('Error Get Todos:', error);
            throw error;
        }
    },

		// update
    async updateTodo(id: string, todo: Partial<Todo>) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, {
                ...todo,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Todo:', error);
            throw error;
        }
    },

		// delete
    async deleteTodo(id: string) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Todo:', error);
            throw error;
        }
    },

		// update status
    async updateStatus(id: string, status: boolean) {
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }

}
```
Pada firestore.ts dilakukan pendeklarasian variabel, lalu terdapat juga operasi-operasi CRUD seperti pada file yaitu: try, read, update, delete, update status

2. InputModal.vue
```
<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? 'Edit' : 'Add' }} Todo</ion-title>
                <template #start>
                    <ion-buttons>
                        <ion-button @click="cancel">
                            <ion-icon :icon="close"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </template>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input v-model="todo.title" label="Title" label-placement="floating"
                    placeholder="Enter Title"></ion-input>
            </ion-item>
            <ion-item>
                <ion-textarea v-model="todo.description" label="Description" label-placement="floating"
                    placeholder="Enter Description" :autogrow="true" :rows="3"></ion-textarea>
            </ion-item>
            <ion-row>
                <ion-col>
                    <ion-button type="button" @click="input" shape="round" color="primary" expand="block">
                        {{ editingId ? 'Edit' : 'Add' }} Todo
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonInput, IonRow, IonCol, IonItem, IonContent, IonTextarea } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Todo } from '@/utils/firestore';

const props = defineProps<{
    isOpen: boolean,
    editingId: string | null,
    todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>
}>();

const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:editingId': [value: string | null],
    'submit': [item: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>]
}>();

const cancel = () => {
    emit('update:isOpen', false);
    emit('update:editingId', null);
    props.todo.title = '';
    props.todo.description = '';
}
const input = () => {
    emit('submit', props.todo);
    cancel();
}
</script>

```
InputModal.vue adalah file untuk menambah atau mengedit data tugas atau todo. Terdapat dua mode, yaitu add, untuk menambah dan edit untuk mengubah data title dan description. Ketika pengguna menekan tombol, komponen akan memancarkan event submit beserta data tugas yang diinputkan. Selain itu, ada fungsi cancel untuk menutup, mereset formulir, dan mengatur ulang status modal dengan memancarkan event update:isOpen dan update:editingId.

3. HomePage.vue
```
const isOpen = ref(false);
const editingId = ref<string | null>(null);
const todos = ref<Todo[]>([]);
const todo = ref<Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>>({
  title: '',
  description: '',
});
const activeTodos = computed(() => todos.value.filter(todo => !todo.status));
const completedTodos = computed(() => todos.value.filter(todo => todo.status));
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// mendapatkan value dari item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// toast notifikasi
const showToast = async (message: string, color: string = 'success', icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top',
    icon
  });
  await toast.present();
};

// mendapatkan perbedaan waktu
const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// handle swipe refresher
const handleRefresh = async (event: any) => {
  try {
    await loadTodos(false);
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    event.target.complete();
  }
};

// handle submit add/edit pada modal
const handleSubmit = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  if (!todo.title) {
    await showToast('Title is required', 'warning', warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateTodo(editingId.value, todo as Todo);
      await showToast('Todo updated successfully', 'success', checkmarkCircle);
    } else {
      await firestoreService.addTodo(todo as Todo);
      await showToast('Todo added successfully', 'success', checkmarkCircle);
    }
    loadTodos();
  } catch (error) {
    await showToast('An error occurred', 'danger', closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

// load data
const loadTodos = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
  }

  try {
    todos.value = await firestoreService.getTodos();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// dijalankan setiap halaman diload, load data dan set interval update 1 menit
onMounted(() => {
  loadTodos();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

// reset interval update
onUnmounted(() => {
  clearInterval(intervalId);
});

// handle edit click
const handleEdit = async (editTodo: Todo) => {
  const slidingItem = itemRefs.value.get(editTodo.id!);
  await slidingItem?.close();

  editingId.value = editTodo.id!;
  todo.value = {
    title: editTodo.title,
    description: editTodo.description,
  }
  isOpen.value = true;
}

// handle delete click/swipe
const handleDelete = async (deleteTodo: Todo) => {
  try {
    await firestoreService.deleteTodo(deleteTodo.id!);
    await showToast('Todo deleted successfully', 'success', checkmarkCircle);
    loadTodos();
  } catch (error) {
    await showToast('Failed to delete todo', 'danger', closeCircle);
    console.error(error);
  }
};

// handle status click/swipe, mengubah status todo active (false)/completed (true)
const handleStatus = async (statusTodo: Todo) => {
  const slidingItem = itemRefs.value.get(statusTodo.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusTodo.id!, !statusTodo.status);
    await showToast(
      `Todo marked as ${!statusTodo.status ? 'completed' : 'active'}`,
      'success',
      checkmarkCircle
    );
    loadTodos();
  } catch (error) {
    await showToast('Failed to update status', 'danger', closeCircle);
    console.error(error);
  }
};
```
HomePage.vue adalah file untuk tampilan halaman yang fungsinya untuk mengelola daftar tugas, seperti menambahkan, mengedit, menghapus, dan mengubah status tugas (aktif atau selesai). Data todo ditampilkan secara terpisah berdasarkan statusnya. Pada HomePage.vue ini terdapat banyak fungsi, yaitu untuk mmemuat data todo dari Firestore (loadTodos), mengelola form modal untuk menambah atau mengedit tugas (handleSubmit), dan memberikan notifikasi berupa toast untuk memberi feedback kepada pengguna (showToast). Lalu ada juga fitur swipe.

## Kesimpulan
Pada Aolikasi ini, dibuat database firestore dulu lalu dilanjutkan dengan file firestore.ts untuk operasi CRUD nya. InputModal.vue menyediakan modal input untuk menambahkan atau mengedit tugas dengan validasi sederhana. Halaman HomePage.vue menampilkan daftar tugas aktif dan selesai dengan desain scroll able dan aksi seperti menghapus, mengedit, atau mengubah status tugas melalui ion-item-sliding. 
