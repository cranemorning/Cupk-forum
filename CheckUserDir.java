public class CheckUserDir {
    public static void main(String[] args) {
        System.out.println("Current user.dir: " + System.getProperty("user.dir"));
        System.out.println("Uploads directory: " + System.getProperty("user.dir") + "\\uploads");
    }
}