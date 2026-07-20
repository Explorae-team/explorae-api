---
status: resolved
trigger: "revise tudo antes de seguir esses erros de dependencia podem ser evitados entes de buildar com uma revisão minunciosa"
---
# Symptoms
- Cannot find a Java installation when foojay is removed.
- Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field 'IBM_SEMERU' when foojay 0.8.0 or 0.9.0 is present.
- User is on Debian Trixie via WSL which cannot install openjdk-17-jdk natively.

# Current Focus
- hypothesis: The Gradle Kotlin compilation within React Native explicitly requests jvmToolchain(17), which forces a download via the broken foojay-resolver since Java 17 is missing.
- next_action: verified fix by bumping jvmToolchain from 17 to 21.

# Resolution
- root_cause: React Native's gradle-plugin hardcoded `jvmToolchain(17)`, forcing foojay-resolver to trigger its auto-download logic, crashing with `IBM_SEMERU` on Gradle 9.3.1.
- fix: Modified all `jvmToolchain(17)` references in `node_modules/@react-native/gradle-plugin` to `jvmToolchain(21)` to utilize the user's existing JDK 21 and bypass foojay-resolver entirely.
