<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';


const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');
// const password = ref('');
// const username = ref('');
const passwordRules = ref([
    (v: string) => !!v || 'Mot de passe requis',
    (v: string) => (v && v.length <= 12) || 'Le mot de passe doit contenir moins de 10 caractères'
]);
// !!v : Cette expression retourne true si v n’est pas vide, sinon false. (Le double point d'exclamation convertit v en un booléen.)
const emailRules = ref([(v: string) => !!v || 'E-mail requis', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);


function validate(values: any, { setErrors }: any) {
    const authStore = useAuthStore();
    return authStore.login(email.value, password.value).catch((error) => setErrors({ apiError: error }));
}
</script>

<template>
 
    <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Email</v-label>
        <VTextField
            v-model="email"
            :rules="emailRules"
            class="mb-8"
            required
            hide-details="auto"
        ></VTextField>
        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Mot de passe</v-label>
        <VTextField
            v-model="password"
            :rules="passwordRules"
            required
            hide-details="auto"
            type="password"
            class="pwdInput"
        ></VTextField>
        <div class="d-flex flex-wrap align-center my-3 ml-n2">
           
        </div>
        <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>Se Connecter</v-btn>
        <div v-if="errors.apiError" class="mt-2">
            <v-alert color="error">{{ errors.apiError }}</v-alert>
        </div>
    </Form>
</template>
