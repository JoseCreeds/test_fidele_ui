<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/layouts/full/logo/Logo.vue";
import { useAuthStore } from "@/stores/auth";
import { Form } from "vee-validate";

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref("");
const email = ref("");
const phone = ref("+22901");

// Indicateurs de validation (touché ou non)
const touched = ref({
  email: false,
  password: false,
  lastname: false,
  firstname: false,
  idPay: false,
  phone: false,
});

const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) => (v && v.length <= 12) || "Password must be less than 10 characters",
]);
const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);
const lastname = ref("");
const firstname = ref("");
const roleUser = ref("Client");
const idPay = ref("");
const fnameRules = ref([
  (v: string) => !!v || "Champs requis",
  (v: string) => (v && v.length <= 20) || "Name must be less than 10 characters",
]);

const resetData = () => {
  lastname.value = " ";
  firstname.value = " ";
  email.value = "";
  password.value = "";
  lastname.value = "";
  phone.value = "+22901";
  idPay.value = "";

  Object.keys(touched.value).forEach(
    (key) => (touched.value[key as keyof typeof touched.value] = false)
  );
};

function validate(values: any, { setErrors }: any) {
  const registerData = ref({
    email: email.value,
    password: password.value,
    lastname: lastname.value,
    firstname: firstname.value,
    role: "",
    idPay: idPay.value,
    phone: phone.value,
  });
  registerData.value.role = roleUser.value === "Client" ? "client" : "vendor";
  const authStore = useAuthStore();
  console.log("registerData.valueregisterData.value", registerData.value);
  return authStore
    .register(registerData.value)
    .then(() => {
      resetData();
    })
    .catch((error) => setErrors({ apiError: error }));
}
</script>
<template>
  <!--<v-row class="d-flex mb-6">
        <v-col cols="6" sm="6">
            <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                <img :src="google" height="20" class="mr-2" alt="google" />
                <span class="d-sm-flex d-none mr-1">Sign up with</span>Google
            </v-btn>
        </v-col>
        <v-col cols="6" sm="6">
            <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                <img :src="facebook" width="25" height="30" class="mr-1" alt="facebook" />
                <span class="d-sm-flex d-none mr-1">Sign up with</span>FB
            </v-btn>
        </v-col>
    </v-row>-->

  <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Email </v-label>
    <VTextField
      v-model="email"
      :rules="touched.email ? emailRules : []"
      required
      @blur="touched.email = true"
    ></VTextField>
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Mot de passe</v-label>
    <VTextField
      v-model="password"
      :counter="10"
      :rules="touched.password ? passwordRules : []"
      required
      @blur="touched.password = true"
      variant="outlined"
      type="password"
      color="primary"
    ></VTextField>

    <v-row style="margin-bottom: -35px">
      <v-col cols="12" sm="6" style="margin-bottom: -25px">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Nom</v-label>
        <VTextField
          v-model="lastname"
          :rules="touched.lastname ? fnameRules : []"
          required
          @blur="touched.lastname = true"
        ></VTextField>
      </v-col>
      <v-col cols="12" sm="6">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Prénom</v-label>
        <VTextField v-model="firstname" :rules="fnameRules" required></VTextField>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="pb-10">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Rôle</v-label>

        <v-select
          v-model="roleUser"
          :items="['Client', 'Vendeur']"
          variant="outlined"
          class="text-body-1"
          hide-details
        ></v-select>
      </v-col>

      <v-col cols="12" sm="6" style="margin-bottom: -25px">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone</v-label>
        <VTextField v-model="phone" required></VTextField>
      </v-col>
    </v-row>

    <v-row style="margin-bottom: -35px">
      <v-col v-if="roleUser === 'Vendeur'" cols="12" sm="6">
        <v-label class="text-subtitle-1 font-weight-medium pb-2">ID kkiapy</v-label>
        <VTextField
          v-model="idPay"
          :rules="touched.idPay ? fnameRules : []"
          required
          @blur="touched.idPay = true"
        ></VTextField>
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap align-center my-3 ml-n2"></div>
    <v-btn
      size="large"
      :loading="isSubmitting"
      color="primary"
      :disabled="valid"
      block
      type="submit"
      flat
      >S'inscrire</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
