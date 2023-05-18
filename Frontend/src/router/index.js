import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Room from "@/views/Room.vue";
// lazy-loaded
const Draw = () => import("@/views/Draw.vue");
const Sentence = () => import("@/views/Sentence.vue");
const Join = () => import("@/views/Join.vue");
const Result = () => import("@/views/Result.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Login,
  },
  {
    path: "/login/:room_id?",
    name: "Login",
    component: Login,
  },
  {
    path: "/join/:room_id",
    name: "Join",
    component: Join,
  },
  {
    path: "/results/",
    name: "Result",
    component: Result,
  },
  {
    path: "/room",
    name: "Room",
    component: Room,
  },
  {
    path: "/draw",
    name: "Draw",
    component: Draw,
  },
  {
    path: "/sentence",
    name: "Sentence",
    component: Sentence,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
