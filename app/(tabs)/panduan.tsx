import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLOR = "#281A14";

export default function PanduanPeminjaman() {
  const [lateDays, setLateDays] = useState("0");

  const lateFeePerDay = 1000;
  const calcFee = (days: string) => Math.max(0, Number(days)) * lateFeePerDay;

  return (
    <View style={{ flex: 1, backgroundColor: "#FDFBF7" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={{
          backgroundColor: "#FFF",
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}>
          <View style={{ alignItems: "center" }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}>
              <Ionicons name="book" size={28} color={COLOR} />
            </View>

            <Text style={{
              fontSize: 22,
              fontWeight: "800",
              color: COLOR,
              textAlign: "center",
              marginBottom: 6,
            }}>
              Panduan Peminjaman Buku
            </Text>

            <Text style={{
              fontSize: 13,
              color: COLOR,
              opacity: 0.7,
              textAlign: "center",
            }}>
              Tata cara meminjam dan mengembalikan buku perpustakaan sekolah
            </Text>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: "#F3F4F6",
              borderRadius: 20,
            }}>
              <Ionicons name="time-outline" size={16} color={COLOR} />
              <Text style={{ fontSize: 12, color: COLOR, marginLeft: 6, opacity: 0.8 }}>
                Senin – Sabtu, 07:00 – 15:00
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Info Cards */}
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 20,
            gap: 12,
          }}>
            <InfoCard icon="book-outline" label="Maks. Buku" value="2 Buku" />
            <InfoCard icon="calendar-outline" label="Masa Pinjam" value="7 Hari" />
            <InfoCard icon="card-outline" label="Identitas" value="Kartu ID" />
            <InfoCard icon="alert-circle-outline" label="Denda" value="Rp 1K/hari" />
          </View>

          {/* Ringkasan */}
          <Section title="Ringkasan Cepat" number="i">
            {[
              "Ajukan pinjaman melalui website perpustakaan sekolah",
              "Setelah disetujui, ambil buku dengan menunjukkan kartu identitas sekolah",
              "Masa peminjaman 7 hari, dapat diperpanjang kapan saja",
              "Kembalikan tepat waktu untuk menghindari denda keterlambatan",
            ].map((item, i) => (
              <ListItem key={i} text={item} />
            ))}
          </Section>

          {/* Cara Meminjam */}
          <Section title="Cara Meminjam Buku" number="1">
            {[
              "Cari buku di katalog web berdasarkan judul, pengarang, atau kategori",
              "Klik tombol Pinjam dan pilih tanggal pengambilan yang diinginkan",
              "Verifikasi menggunakan kartu identitas yang terdaftar",
              "Tunggu persetujuan dari petugas perpustakaan",
              "Terima notifikasi persetujuan melalui email/WA/aplikasi",
              "Ambil buku di perpustakaan dengan menunjukkan kartu identitas",
            ].map((text, i) => (
              <Step key={i} number={i + 1} text={text} />
            ))}
          </Section>

          {/* Jam Operasional */}
          <Section title="Jam Operasional & Identitas" number="2">
            <OperationalAndIdentity />
          </Section>

          {/* Lama Peminjaman */}
          <Section title="Lama Peminjaman & Denda" number="3">
            <LoanAndFine 
              lateDays={lateDays} 
              setLateDays={setLateDays} 
              calcFee={calcFee} 
            />
          </Section>

          {/* Cara Mengembalikan */}
          <Section title="Cara Mengembalikan Buku" number="4">
            <View style={{ gap: 12 }}>
              {[
                "Datang ke meja pengembalian sesuai jam operasional",
                "Serahkan buku beserta kartu identitas sekolah",
                "Petugas akan memeriksa kondisi buku",
                "Jika rusak/hilang, wajib mengganti atau membayar",
              ].map((text, i) => (
                <ReturnStep key={i} number={i + 1} text={text} />
              ))}
            </View>
          </Section>

          {/* Tips */}
          <Section title="Tips & Rekomendasi" number="5">
            <Tips />
          </Section>

          {/* Footer */}
          <View style={{
            marginTop: 32,
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          }}>
            <Text style={{
              fontSize: 13,
              color: COLOR,
              opacity: 0.6,
              textAlign: "center",
            }}>
              Kebijakan dapat berubah sewaktu-waktu. Hubungi petugas untuk informasi lebih lanjut.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* --- COMPONENTS --- */

function InfoCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={{
      flex: 1,
      minWidth: 150,
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}>
          <Ionicons name={icon} size={20} color={COLOR} />
        </View>
        <Text style={{ fontSize: 12, color: COLOR, opacity: 0.7 }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 18, fontWeight: "800", color: COLOR }}>
        {value}
      </Text>
    </View>
  );
}

function Section({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 16,
      padding: 20,
      marginTop: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      }}>
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: COLOR,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}>
          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>
            {number}
          </Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "800", color: COLOR }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    }}>
      <Ionicons name="checkmark-circle" size={20} color={COLOR} style={{ marginRight: 12, marginTop: 2 }} />
      <Text style={{ fontSize: 14, color: COLOR, opacity: 0.8, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 14,
      backgroundColor: "#F9FAFB",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      marginBottom: 10,
    }}>
      <View style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: COLOR,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      }}>
        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 12 }}>
          {number}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: COLOR, opacity: 0.8, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function OperationalAndIdentity() {
  return (
    <View style={{ gap: 20 }}>
      {/* Jadwal */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLOR, marginBottom: 12 }}>
          Jadwal Perpustakaan
        </Text>
        <View style={{ gap: 8 }}>
          <InfoRow label="Hari Operasional" value="Senin – Sabtu" />
          <InfoRow label="Jam Buka" value="07:00 – 15:00" />
          <InfoRow label="Istirahat Petugas" value="11:30 – 13:00" />
          <InfoRow label="Hari Minggu" value="Libur" badge />
        </View>

        <View style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: "#FEF3C7",
          borderWidth: 1,
          borderColor: "#FDE68A",
          borderRadius: 10,
        }}>
          <Text style={{ fontSize: 13, color: "#92400E" }}>
            💡 Hindari jam istirahat untuk pelayanan lebih cepat
          </Text>
        </View>
      </View>

      {/* Identitas */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLOR, marginBottom: 12 }}>
          Syarat Identitas
        </Text>
        <View style={{ gap: 12 }}>
          {[
            "Kartu identitas sekolah yang masih aktif",
            "Terdaftar dalam sistem perpustakaan",
            "Tidak ada tunggakan denda",
            "Berlaku untuk semua warga sekolah",
          ].map((text, i) => (
            <CheckItem key={i} text={text} />
          ))}
        </View>
      </View>
    </View>
  );
}

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    }}>
      <Text style={{ fontSize: 14, color: COLOR, opacity: 0.7 }}>
        {label}
      </Text>
      {badge ? (
        <View style={{
          paddingHorizontal: 12,
          paddingVertical: 4,
          backgroundColor: "#FEE2E2",
          borderRadius: 20,
        }}>
          <Text style={{ fontSize: 12, color: "#DC2626", fontWeight: "600" }}>
            {value}
          </Text>
        </View>
      ) : (
        <Text style={{ fontSize: 14, fontWeight: "700", color: COLOR }}>
          {value}
        </Text>
      )}
    </View>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: COLOR,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      }}>
        <Ionicons name="checkmark" size={16} color="#FFF" />
      </View>
      <Text style={{ fontSize: 14, color: COLOR, opacity: 0.8, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function LoanAndFine({ lateDays, setLateDays, calcFee }: any) {
  return (
    <View>
      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <StatBox label="Durasi Peminjaman" value="7 Hari" />
        <StatBox label="Perpanjangan" value="Bebas" />
        <StatBox label="Maks. Buku" value="2 Buku" />
      </View>

      {/* Alerts */}
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Alert 
          type="info" 
          text="Buku referensi umumnya tidak dapat dipinjam dan hanya dibaca di tempat" 
        />
        <Alert 
          type="warning" 
          text="Denda Rp1.000 per hari mulai dari hari setelah tanggal jatuh tempo" 
        />
        <Alert 
          type="info" 
          text="Perpanjangan dapat dilakukan berkali-kali selama buku tidak dipesan peminjam lain" 
        />
      </View>

      {/* Calculator */}
      <FineCalculator
        lateDays={lateDays}
        setLateDays={setLateDays}
        calcFee={calcFee}
      />
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#F9FAFB",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      padding: 14,
    }}>
      <Text style={{ fontSize: 11, color: COLOR, opacity: 0.7, marginBottom: 6 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "800", color: COLOR }}>
        {value}
      </Text>
    </View>
  );
}

function Alert({ type, text }: { type: "info" | "warning"; text: string }) {
  const styles = {
    info: { bg: "#DBEAFE", border: "#93C5FD", text: "#1E40AF" },
    warning: { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
  };

  const icons = {
    info: "information-circle",
    warning: "warning",
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 12,
      backgroundColor: styles[type].bg,
      borderWidth: 1,
      borderColor: styles[type].border,
      borderRadius: 10,
    }}>
      <Ionicons 
        name={icons[type]} 
        size={20} 
        color={styles[type].text} 
        style={{ marginRight: 10, marginTop: 1 }} 
      />
      <Text style={{ fontSize: 13, color: styles[type].text, fontWeight: "600", flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function FineCalculator({ lateDays, setLateDays, calcFee }: any) {
  return (
    <View style={{
      backgroundColor: "#F9FAFB",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      padding: 16,
    }}>
      <Text style={{ fontSize: 15, fontWeight: "700", color: COLOR, marginBottom: 12 }}>
        Kalkulator Denda
      </Text>

      <View style={{ gap: 12 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: "600", color: COLOR, marginBottom: 6 }}>
            Hari terlambat:
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 15,
              backgroundColor: "#FFF",
              color: COLOR,
            }}
            keyboardType="number-pad"
            value={lateDays}
            onChangeText={setLateDays}
            placeholder="0"
          />
        </View>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFF",
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 10,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <Text style={{ fontSize: 13, color: COLOR, opacity: 0.7 }}>
            Total Denda:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: COLOR }}>
            Rp {calcFee(lateDays).toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReturnStep({ number, text }: { number: number; text: string }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 12,
      backgroundColor: "#F9FAFB",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 10,
    }}>
      <View style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: COLOR,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}>
        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 12 }}>
          {number}
        </Text>
      </View>
      <Text style={{ fontSize: 13, color: COLOR, opacity: 0.8, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function Tips() {
  const tipList = [
    { icon: "calendar-outline", text: "Catat tanggal jatuh tempo di kalender" },
    { icon: "call-outline", text: "Hubungi petugas jika berhalangan" },
    { icon: "bookmark-outline", text: "Gunakan pembatas buku" },
    { icon: "document-text-outline", text: "Simpan kartu identitas dengan baik" },
  ];

  return (
    <View style={{ gap: 12 }}>
      {tipList.map((tip, i) => (
        <TipItem key={i} icon={tip.icon} text={tip.text} />
      ))}
    </View>
  );
}

function TipItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      backgroundColor: "#F9FAFB",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 10,
    }}>
      <Ionicons name={icon} size={20} color={COLOR} style={{ marginRight: 12 }} />
      <Text style={{ fontSize: 13, color: COLOR, opacity: 0.8, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}